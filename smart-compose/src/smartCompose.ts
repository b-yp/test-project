import { debounce } from "./utils"

const baseUrl = 'http://127.0.0.1:3000'

const contentEditableElements = document.querySelectorAll('[contenteditable]')

const isNodeElement = variable => variable instanceof Node && variable.nodeType === 1

const fetchSmartContent = () => {
  const controller = new AbortController();
  const signal = controller.signal;


  const fetchPromise = (text: string) => new Promise<{ activeEle: Node | Element, smartText: string }>((resolve, reject) => {
    fetch(`${baseUrl}/api/smartCompose`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ text }),
      signal,
    })
      .then(res => res.json())
      .then(res => {
        const smartText = res.content
        const range = window.getSelection().getRangeAt(0)
        const activeEle = isNodeElement(range.commonAncestorContainer) ? range.commonAncestorContainer : range.startContainer.parentNode

        const placeholderEle = document.createElement('div')
        placeholderEle.className = 'custom-placeholder-element'
        placeholderEle.textContent = smartText
        placeholderEle.style.color = 'gray'
        placeholderEle.style.userSelect = 'none'
        placeholderEle.style.display = 'inline'
        placeholderEle.style.opacity = '0.5'
        placeholderEle.style.cursor = 'default'
        placeholderEle.contentEditable = 'false'

        activeEle.appendChild(placeholderEle)

        resolve({ activeEle, smartText })
      })
  })

  return {
    fetchPromise,
    controller,
  }
}

contentEditableElements.forEach(el => {
  let activeEle: HTMLElement | Node | null = null
  let smartText: string = ''
  let lastController: AbortController | null = null

  el.addEventListener('input', debounce(async () => {
    const { fetchPromise, controller } = fetchSmartContent()
    if (lastController) {
      lastController.abort()
    }
    lastController = controller
    const content = await fetchPromise(el.innerHTML)
    activeEle = content.activeEle
    smartText = content.smartText
  }, 1000))

  el.addEventListener('keydown', (e: KeyboardEvent) => {
    const placeholderEle = document.querySelector('.custom-placeholder-element')
    placeholderEle?.remove()
    if (e.code === 'Tab') {
      e.preventDefault();
      (activeEle as HTMLElement).innerHTML = `${(activeEle as HTMLElement).innerHTML}${smartText}`
      const range = document.createRange()
      range.selectNodeContents(activeEle)
      range.collapse(false)
      const selection = window.getSelection()
      selection.removeAllRanges()
      selection.addRange(range)
    }
  })
})

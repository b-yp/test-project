import './style.css'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <div class="contenteditable" contenteditable></div>
    <br>
    <div class="contenteditable" contenteditable></div>
  </div>
`

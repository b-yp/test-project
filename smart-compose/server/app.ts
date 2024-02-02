import Koa from 'koa';
import Router from 'koa-router';
import Body from 'koa-body';
import Cors from '@koa/cors';

const app = new Koa();
const router = new Router();

const apiBaseUrl = 'https://api.ypll.xyz'
const aiBaseUrl = 'https://aip.baidubce.com'

const fetchAccessToken = () => fetch(`${apiBaseUrl}/api/yiyan`).then(res => res.json())

const fetchSmartContent = (text: string) =>
  new Promise((resolve, reject) => {
    fetchAccessToken().then((res: any) => {
      const accessToken = res.access_token;
      fetch(`${aiBaseUrl}/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/completions_pro?access_token=${accessToken}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            {

              role: 'user',
              content: "你现在要做一个智能撰写的机器人，我会给你一段文字（有可能完整有可能不完整），你需要在这段文字的基础上猜测接下来我要输入的内容并返回，注意：只需要返回接下来要输入的内容，而不返回原文，明白了吗？"
            },
            {
              role: 'assistant',
              content: `明白了，请输入你需要扩写的文字。`,
            },
            {
              role: 'user',
              content: text,
            }
          ],
          temperature: 0.1,
        }),
      }).then(res => {
        return res.json()
      }).then((res: any) => {
        if (res.error_code && res.error_msg) {
          reject(res.error_msg)
        } else {
          resolve(res.result)
        }
      })
    })
  })


router.post('/api/smartCompose', async (ctx: any) => {
  const { text } = ctx.request.body;

  const content = await fetchSmartContent(text)
  ctx.body = { content };
});

app.use(Cors());
app.use(Body());
app.use(router.routes());
app.use(router.allowedMethods());

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

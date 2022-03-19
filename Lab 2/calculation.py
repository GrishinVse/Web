from aiohttp import web

routes = web.RouteTableDef()

@routes.get('/hello')
async def hello(req):
    return web.Response(text=f"Hello, students")

@routes.post('/python')
async def main(req):
    data = await req.json()
    print(data)
    return web.Response(text=generate_html(data), content_type='text/html')

def generate_html(data):
    html_content = '<!DOCTYPE html><html><head><h1>This is client Data</h1></head><body><div>'+''.join(["<p>{} : {}</p>".format(el, data[el]) for el in data])+'</div></body></html>'
    print(''.join(["<p>{} : {}</p>".format(el, data[el]) for el in data]))
    return html_content

app = web.Application()
app.add_routes(routes)
web.run_app(app, port=8081)
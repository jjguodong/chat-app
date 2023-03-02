import React, { useState } from 'react'
import { Form, Layout, Select, Slider, Input } from 'antd'
import { SendOutlined, LoadingOutlined } from '@ant-design/icons';
import './App.css';
import { chatApi } from './api';

const { Header, Footer, Content } = Layout;
const { Option } = Select;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const initialValues = {
  model: "text-davinci-003",
  temperature: 0,
  max_tokens: 100,
  top_p: 1,
  frequency_penalty: 0.0,
  presence_penalty: 0.0,
}

function App() {
  const [list, setList] = useState([
    {
      content: '请问有什么可以帮您？',
      author: 'AI'
    },
  ]);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const handleSend = async () => {
    const config = form.getFieldsValue();
    const prevPropmt = list.reduce((prev, current)=> prev+ current.author + ':' + current.content + '\n', '') + 'Human:' + prompt + '\n';
    const params = {
      config: { ...config, stop: [" Human:", " AI:"] },
      prompt: prevPropmt
    }
    setList([...list, { content: prompt, author: 'Human'}, { content: '思考中...', author: 'AI'}])
    setPrompt('');
    setLoading(true)
    try {
      const {data} = await chatApi(params)
      const result = parseContent(prevPropmt + data.result);
      setList(result);
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }

  }
  const parseContent = (content)=>{
    const list = content.split('\n').filter(Boolean);
    return list.map(item=>parseSentence(item));
  }
  const parseSentence = (str)=>{
    if(/AI\:/.test(str)){
      return {
        content: str.replace(/AI:/,''),
        author: 'AI'
      }
    }else {
      return {
        content: str.replace(/Human:/,''),
        author: 'Human'
      }
    }
  }
  return (
    <Layout className='page-container'>
      <Header className='page-header'>ChatGPT PlayGround</Header>
      <Layout>
        <Content className='page-content'>
          <div className='chat-container'>
            <div className='chat-list'>
              {
                list.map((item, index)=> <div key={index} className={`chat-item text-${item.author}`}>{item.author+'：'}{item.content}</div>)
              }
            </div>
            <div className='input-container'>
              <Input className="chat-input" value={prompt} onChange={(e) => { setPrompt(e.target.value) }} />
              <div className='send-btn-container' onClick={handleSend}>{loading ? <LoadingOutlined /> : <SendOutlined />}</div>
            </div>

          </div>
          <div className='chat-config'>
            <div className='title'>配置面板</div>
            <Form form={form} {...layout} labelAlign='left' initialValues={initialValues}>
              <Form.Item label='Model' name="model">
                <Select>
                  <Option value='text-davinci-003'></Option>
                  <Option value='text-curie-001'></Option>
                  <Option value='text-babbage-001'></Option>
                  <Option value='text-ada-001'></Option>
                </Select>
              </Form.Item>
              <Form.Item label='Temperature' name="temperature">
                <Slider max={1} step={0.01} min={0}></Slider>
              </Form.Item>
              <Form.Item label='Max Tokens' name="max_tokens">
                <Slider max={1000} step={100} min={0}></Slider>
              </Form.Item>
              <Form.Item label='Top p' name="top_p">
                <Slider max={1} step={0.01} min={0}></Slider>
              </Form.Item>
              <Form.Item label='Frequency penalty' name="frequency_penalty">
                <Slider max={2} step={0.01} min={0}></Slider>
              </Form.Item>
              <Form.Item label='Presence penalty' name="presence_penalty">
                <Slider max={2} step={0.01} min={0}></Slider>
              </Form.Item>
            </Form>
          </div>
        </Content>
      </Layout>
      <Footer className='page-footer'>过来玩呀！！！！！！</Footer>
    </Layout >
  );
}

export default App;

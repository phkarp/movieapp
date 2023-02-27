import { Space, Spin } from 'antd';
import './loading.css';

const Loading = () => (
  <Space
    direction="vertical"
    style={{
      width: '100%',
    }}
    size="large"
  >
    <Spin tip="Loading" size="large" className="content"></Spin>
  </Space>
);

export default Loading;

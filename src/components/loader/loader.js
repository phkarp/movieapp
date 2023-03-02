import { Space, Spin } from 'antd';
import './loader.css';

const Loader = () => (
  <Space
    direction="vertical"
    style={{
      width: '100%',
    }}
    size="large"
  >
    <Spin tip="Loader" size="large" className="content"></Spin>
  </Space>
);

export default Loader;

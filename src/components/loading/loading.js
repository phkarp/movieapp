import { Space, Spin } from 'antd';
import './loading.css';

const Loading = () => (
  <Space
    direction="vertical"
    style={{
      width: '100%',
    }}
    size="large"
    align="center"
  >
    <Space>
      <Spin tip="Loading" size="large">
        <div className="content" />
      </Spin>
    </Space>
  </Space>
);

export default Loading;

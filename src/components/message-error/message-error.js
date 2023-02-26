import { Alert, Space } from 'antd';
const MessageError = ({ errorDescription }) => (
  <Space
    direction="vertical"
    style={{
      width: '100%',
    }}
  >
    <Alert message={errorDescription.name} description={errorDescription.message} type="error" />
  </Space>
);
export default MessageError;

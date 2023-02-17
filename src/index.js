import { createRoot } from 'react-dom/client';
import { Pagination } from 'antd';

import Search from './components/search/search';
import FilmsContainer from './components/films-container/films-container';
import './index.css';

const App = () => {
  return (
    <div className="movies-body">
      <Search />
      <FilmsContainer />
      <Pagination defaultCurrent={1} total={50} />
    </div>
  );
};

const root = createRoot(document.getElementById('root'));
root.render(<App />);

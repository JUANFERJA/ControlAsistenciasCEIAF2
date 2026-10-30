
import 'animate.css';

import { BrowserRouter } from 'react-router-dom';
import { MasterPage } from './pages/MasterPage';
import { AuthProvider } from './auth/context/AuthProvider';
import { DataProvider } from './context/DataProvider';
import { RefreshProvider } from './context/RefreshProvider';



function App() {

  return (


    <AuthProvider>

      <DataProvider>
        <RefreshProvider>
          <BrowserRouter>
            <MasterPage />
          </BrowserRouter>
        </RefreshProvider>
      </DataProvider>
    </AuthProvider>


  );
}

export default App;

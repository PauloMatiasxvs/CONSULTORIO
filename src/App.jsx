import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import PatientList from './components/PatientList';
import PatientForm from './components/PatientForm';
import { useEffect, useState } from 'react';
import { supabase } from './services/supabase';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { theme } from './theme/theme';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user || null);
    };
    
    checkSession();
    supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Auth />} />
          <Route path="/dashboard" element={<PatientList />} />
          <Route path="/patient/new" element={<PatientForm />} />
          <Route path="/patient/:id" element={<PatientForm />} />
          <Route path="/charts" element={<Charts />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
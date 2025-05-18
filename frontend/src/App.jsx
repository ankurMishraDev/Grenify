
import { Routes, Route } from 'react-router';
import CallPage  from './pages/CallPage.jsx';
import  HomePage  from './pages/HomePage.jsx';
import  LoginPage  from './pages/LoginPage.jsx';
import  NotificationPage  from './pages/NotificationPage.jsx';
import  OnboardingPage  from './pages/OnboardingPage.jsx';
import  SignUpPage  from './pages/SignUpPage.jsx';
import  ChatPage  from './pages/ChatPage.jsx';
import  { Toaster}  from 'react-hot-toast';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
const App = () => {
  const {data, isLoading, error}= useQuery({
    queryKey: ["todos"],
    queryFn: async ()=>{
      const res = await axios.get("https://jsonplaceholder.typicode.com/todos");
      
      return res.data;
    }
  })
  console.log(data);
  

  return (
    <div className='h-screen ' data-theme="black">
      
     <Routes>
      <Route path='/' element={<HomePage />} />
      <Route path='/login' element={<LoginPage />} />
      <Route path='/call' element={<CallPage />} />
      <Route path='/chat' element={<ChatPage />} />
      <Route path='/notification' element={<NotificationPage />} />
      <Route path='/onboarding' element={<OnboardingPage />} />
      <Route path='/signup' element={<SignUpPage />} />
     </Routes>
     <Toaster />
    </div>
  )
}

export default App

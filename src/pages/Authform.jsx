import React, { useState } from 'react';
function Authform(){
  const[isLogin , SetIsLogin] = useState(true);
  return (
    <div className= 'container'>
      <div className= 'form-container'>
        <div className= 'form-toggle'>
          <button className= {isLogin? 'active' : ''} onClick={()=> SetIsLogin(true)}>Login</button>
        <button className= {!isLogin ? 'active' : ''} onClick={()=> SetIsLogin(false)}>Signup</button>

        </div>
         {isLogin ? <>
      <div className= 'form'>
      <h2>Login Form</h2>
      <input type= 'email' placeholder= 'Email' /> 
      <input type="password" placeholder= 'password' /> 
      <a href="#">Forgot Password</a>
      <button>Login</button>
      <p>Not a member? <a href="#" onClick= {()=> SetIsLogin(false)}>Sigup now</a> </p>
      
      </div>
      
      </> : <>
      <div className= 'form'>
       <h2>Signup form</h2>
      <input type= 'email' placeholder= 'Email' /> 
      <input type="password" placeholder= 'password' />
      <input type="password" placeholder= 'Confirm Password' /> 
      <button>Signup</button></div>
      </>}
      </div>
    </div>
   
    )
  
}
export default Authform;
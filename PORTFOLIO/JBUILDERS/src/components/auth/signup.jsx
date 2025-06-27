import React, { useState } from 'react';
import { auth } from './firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import './signin.css'
function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const signIn = (e) => {
    e.preventDefault(); // Add this line to prevent the default form submission
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredentials) => {
        console.log('User signed in:', userCredentials.user);
        // You can provide user feedback or navigate to another page here
      })
      .catch((error) => {
        console.error('Sign-in error:', error.message);
        // You can provide user feedback or display an error message here
      });
  };

  return (
    <div className='sign-in-container'>
      <form className='sign-in-form' onSubmit={signIn}>
        <h1 className='sign-in-title'>Log Into your Account</h1>
        <input
          className='sign-in-input'
          type='email'
          placeholder='Email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className='sign-in-input'
          type='password'
          placeholder='Password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className='sign-in-button' type='submit'>
          Log In
        </button>
      </form>
      </div>
  );
}

export default SignIn;

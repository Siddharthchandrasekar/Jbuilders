import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth'; // Make sure to import the correct function from Firebase
import { auth } from './firebase';
import './style.css'

function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const signup = (e) => {
    e.preventDefault();
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredentials) => {
        console.log(userCredentials);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className='sign-up-container'>
      <form className='sign-up-form' onSubmit={signup}>
        <h1 className='sign-up-title'>Create Account</h1>
        <input
          type='email'
          placeholder='Email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className='sign-up-input'
        />
        <input
          type='password'
          placeholder='Password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className='sign-up-input'
        />
        <button
          type='submit'
          className='sign-up-button'
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}

export default SignUp;

import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Auth } from 'aws-amplify';

const initialFormState = {
  username: "",
  password: "paSSw0rd20",
  email: "",
  code: "",
  formType: 'signIn'
}

function App() {
  const [formState, updateFormState] = React.useState(initialFormState)
  const { formType } = formState

  function onChange(e) {
    e.persist()
    updateFormState(() => ({ ...formState, [e.target.name]: e.target.value  }))
  }

  async function signUp() {
    const { username, email, password } = formState
    await Auth.signUp({ username, password, attributes: { email } })
    updateFormState({ ...formState, formType: "confirmSignUp" })
  }
  async function confirmSignUp() {
    const { username, code } = formState
    
    console.log(code)
    debugger
    await Auth.confirmSignUp( username, code )
    updateFormState({ ...formState, formType: "signIn" })
  }
  async function signIn() {
    const { username, password } = formState
    await Auth.signIn(username, password) 
    updateFormState({ ...formState, formType: "signedIn" })
  }

  async function retrievePassword() {
    const { username, code, password } = formState
    await Auth.forgotPasswordSubmit(username, code, password)
    updateFormState({ ...formState, formType: "donePasswrodRetrieve" })
  }

  return (
    <div className="App">
      <header className="App-header">
        {formType === 'signUp' && (
          <div>
            <input name="username"
              onChange={onChange}
              placeholder="put username here" /><br></br>
            <input
              name="password"
              type="password"
              onChange={onChange}
              placeholder="password" /><br></br>

            <input
              name="email"
              onChange={onChange}
              placeholder="put any email here" /><br></br>
            <button onClick={signUp}>Sign Up</button>
          </div>
        )}
        {formType === 'confirmSignUp' && (
          <div>
            <input name="code"
              onChange={onChange}
              placeholder="auth code" /><br></br>
            <button onClick={confirmSignUp}>Confirm SIgnup</button>
          </div>
        )}
        {formType === 'signIn' && (
          <div>
            <input name="username" onChange={onChange} placeholder="put username here" /><br></br>
            <input name="password" onChange={onChange} placeholder="put password here" /><br></br>
            <button onClick={signIn}>Sign In</button>
            <span onClick={() => updateFormState({...formState, formType:"forgetPassword"})}>
                click to reset password
              </span>
          </div>
        )}
        {formType === 'signedIn' && (
          <div><h1>Welcome, you have signed in</h1></div>
        )}
        {formType === 'forgetPassword' && (
          <div>
            <input name="username" onChange={onChange} placeholder="enter your username to retrive password"></input><br></br>
            <input name="code" onChange={onChange} placeholder="enter your code to retrive password"></input><br></br>
            <input name="password" onChange={onChange} placeholder="enter your password to retrive password"></input><br></br>
            <button onClick={retrievePassword}>Retrive Passwrod</button>
          </div>
        )}
        {formType === 'donePasswrodRetrieve' && (
          <div><h1>password has been sent to youF</h1></div>
        )}
      </header>
    </div>
  );
}

export default App;

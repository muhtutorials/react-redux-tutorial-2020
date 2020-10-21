import React from 'react'
import ReactDOM from 'react-dom'

import { fetchUsers } from './features/users/usersSlice'
import './index.css'
import './primitiveui.css'
import App from './App'
import store from './app/store'
import { Provider } from 'react-redux'

import './api/server'

store.dispatch(fetchUsers())

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
)

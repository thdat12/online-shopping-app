import React, { useEffect, Suspense } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import store from './store'
import { loadUser } from './actions/userActions'
import AuthRoute from './AuthRoute'
import NavBar from './components/nagivation/NavBar'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import UserInfor from './pages/UserInfor'
import UploadProduct from './pages/UploadProduct'
import ProductDetail from './pages/ProductDetail';
import CartPage from './pages/CartPage';
import DashBoard from './pages/DashBoard';
import OwnProduct from './pages/OwnProduct';
import History from './pages/History';
import PaymentListPage from './pages/PaymentListPage';
import { connect } from 'react-redux';
import ViewUserInfor from './pages/ViewUserInfor';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import UpdateUserProfile from './pages/UpdateUserProfile';
import UpdateProductPage from './pages/UpdateProductPage';
import UserPaymentList from './pages/UserPaymentList';
import ViewPaymentList from './pages/ViewPaymentList';

import 'semantic-ui-css/semantic.min.css';
import './layouts/LandingPage.css'
import './layouts/CartPage.css'
import './App.css';


function App(props) {
  useEffect(() => {
    store.dispatch(loadUser())
  }, [])
  return (
    <Router>
      <div className="App">
        <Suspense fallback={(<div>Loading....</div>)}>
          <NavBar />
          <Switch>
            <Route exact path='/' component={Home} />
            <Route exact path='/login' component={Login} />
            <Route exact path='/register' component={Register} />
            <Route exact path='/user/forgot' component={ForgotPasswordPage} />
            <Route exact path='/user/reset/:token' component={ResetPasswordPage} />
            <AuthRoute exact path='/user/paymentList' component={UserPaymentList} />
            <AuthRoute exact path='/user/infor' component={UserInfor} />
            <AuthRoute exact path='/user/update' component={UpdateUserProfile} />
            <AuthRoute exact path='/user/ownProduct' component={OwnProduct} />
            <AuthRoute exact path='/user/cart' component={CartPage} />
            <AuthRoute exact path='/user/history' component={History} />
            <AuthRoute exact path='/product/upload' component={UploadProduct} />
            <AuthRoute exact path='/product/update/:id' component={UpdateProductPage} />
            <AuthRoute exact path='/payment/:id' component={ViewPaymentList} />
            <Route exact path='/product/product_by_id/:productId' component={ProductDetail} />
            <AuthRoute exact path='/admin/dashboard' component={DashBoard} />
            <AuthRoute exact path='/admin/paymentList' component={PaymentListPage} />
            <AuthRoute exact path='/viewUser/:id' component={ViewUserInfor} />
          </Switch>
        </Suspense>
      </div>
    </Router>
  )
}

const mapStateToProps = state => ({
  user: state.user,
  products: state.products
})

export default connect(mapStateToProps)(App);

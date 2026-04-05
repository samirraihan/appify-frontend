import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    try {
      await login(email, password)
      navigate('/feed')
    } catch (err) {
      setError(err?.response?.data?.message || 'Login failed')
    }
  }

  return (
    <section className="_social_login_wrapper _layout_main_wrapper">
      <div className="_social_login_wrap container">
        <div className="row align-items-center">
          <div className="col-xl-8 col-lg-8 d-none d-lg-block">
            <div className="_social_login_left_image">
              <img src="/assets/images/login.png" alt="Image" className="_left_img" />
            </div>
          </div>
          <div className="col-xl-4 col-lg-4 col-md-12">
            <div className="_social_login_content">
              <div className="_social_login_left_logo _mar_b28">
                <img src="/assets/images/logo.svg" alt="Image" className="_left_logo" />
              </div>
              <p className="_social_login_content_para _mar_b8">Welcome back</p>
              <h4 className="_social_login_content_title _titl4 _mar_b50">Login to your account</h4>
              <form className="_social_login_form" onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-12">
                    <div className="_social_login_form_input _mar_b14">
                      <label className="_social_login_label _mar_b8">Email</label>
                      <input value={email} onChange={(e)=>setEmail(e.target.value)} type="email" className="form-control _social_login_input" required />
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="_social_login_form_input _mar_b14">
                      <label className="_social_login_label _mar_b8">Password</label>
                      <input value={password} onChange={(e)=>setPassword(e.target.value)} type="password" className="form-control _social_login_input" required />
                    </div>
                  </div>
                </div>
                {error && <div className="text-danger">{error}</div>}
                <div className="_social_login_form_btn _mar_t40 _mar_b60">
                  <button type="submit" className="_social_login_form_btn_link _btn1">Login now</button>
                </div>
              </form>
              <div className="_social_login_bottom_txt">
                <p className="_social_login_bottom_txt_para">Dont have an account? <a href="/register">Create New Account</a></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

import { useEffect, useState } from "react"
import { login, register, forgotPassword, resetPassword} from "../services/authService"
import './AuthView.css'

interface Props {
  onLogin: (token: string, user: any) => void
}

type ViewMode = 'login' | 'register' | 'forgot' | 'reset'

function Auth({ onLogin }: Props) {
  const [view, setView] = useState<ViewMode>('login')
  const [message, setMessage] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const [form, setForm] = useState({
      name: '',
      email: '',
      password: '',
      confirm_password: '',
      resetToken: ''
    })

    const [errors, setErrors] = useState({
      email: '',
      password: '',
      confirm_password: ''
    })

    useEffect(() => {
      const params = new URLSearchParams(window.location.search)
      const token = params.get('token')
      if (token) {
        setForm(prev => ({ ...prev, resetToken: token }))
        setView('reset')
      }
    }, [])

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
      setForm({ ...form, [e.target.name]: e.target.value })
    }

  async function handleSubmit() {
    let newErrors = {
      email: '',
      password: '',
      confirm_password: ''
    }

    if (!form.email) newErrors.email = 'Digite seu email!'
    if (!form.email.includes('@')) newErrors.email = 'Email inválido'
    if (!form.password) newErrors.password = 'Digite sua senha!'
    if (form.password.length < 6) newErrors.password = 'A senha deve ter no mínimo 6 caracteres'
    if (view === 'register' && form.password !== form.confirm_password) {
      newErrors.confirm_password = 'As senhas não coincidem'
    }

    setErrors(newErrors)
  
    // Se tiver erro, NÃO envia
    if (newErrors.email || newErrors.password || newErrors.confirm_password) return
    
    try {
      if(view === 'register'){
        const data = await register(form.name, form.email, form.password)
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        onLogin(data.token, data.user)
      } else {
        const data = await login(form.email, form.password)
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        onLogin(data.token, data.user)
      }
      
    } catch (err: any) {
      if (err.response?.status === 401) {
        setErrors({ ...errors, password: 'Email e/ou senha incorretos' })
      }
    }
  }
     
  async function handleForgotPassword() {
    if (!form.email || !form.email.includes('@')) {
      setErrors({ ...errors, email: 'Digite um email válido' })
      return
    }

    try {
      await forgotPassword(form.email)
      setMessage('Se o email existir, um link de recuperação foi enviado.')
    } catch (err) {
      setMessage('Erro ao enviar email. Tente novamente.')
    }
  }

  async function handleResetPassword() {
    let newErrors = { email: '', password: '', confirm_password: '' }

    if (!form.password) newErrors.password = 'Digite a nova senha!'
    if (form.password.length < 6) newErrors.password = 'A senha deve ter no mínimo 6 caracteres'
    if (form.password !== form.confirm_password) newErrors.confirm_password = 'As senhas não coincidem'

    setErrors(newErrors)
    if (newErrors.password || newErrors.confirm_password) return

    try {
      await resetPassword(form.resetToken, form.password)
      setMessage('Senha redefinida com sucesso! Faça login.')
      setView('login')
    } catch (err) {
      setMessage('Token inválido ou expirado.')
    }
  }
    
    
 

  return (
    <div className="auth-wrapper">

      {view === 'register' && (
        <div className="auth-form">
          <label>Nome:</label>
          <input name="name" value={form.name} onChange={handleChange}/>

          <label>Email:</label>
          <input name="email" value={form.email} onChange={handleChange}/>
          {errors.email && <span className="erro">{errors.email}</span>}

          <label>Senha:</label>
          <div className="password-wrapper">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={form.password}
              onChange={handleChange}
            />
            <span className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
              <i className={`fi ${showPassword ? 'fi-sr-eye-crossed' : 'fi-rs-eye'}`}></i>
            </span>
          </div>
          {errors.password && <span className="erro">{errors.password}</span>}

          <label>Repetir senha:</label>
          <div className="password-wrapper">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirm_password"
              value={form.confirm_password}
              onChange={handleChange}
            />
            <span className="toggle-password" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
              <i className={`fi ${showConfirmPassword ? 'fi-sr-eye-crossed' : 'fi-rs-eye'}`}></i>
            </span>
          </div>
          {errors.confirm_password && <span className="erro">{errors.confirm_password}</span>}

          <button className="login" onClick={handleSubmit}>Cadastrar</button>

          <span className="options">
            <button onClick={() => setView('login')}>Já possuo cadastro</button>
          </span>
        </div>
      )}

      {view === 'login' && (
        <div className="auth-form">
          <label>Email:</label>
          <input name="email" value={form.email} onChange={handleChange}/>

          <label>Senha:</label>
          <div className="password-wrapper">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={form.password}
              onChange={handleChange}
            />
            <span className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
              <i className={`fi ${showPassword ? 'fi-sr-eye-crossed' : 'fi-rs-eye'}`}></i>
            </span>
          </div>
          {errors.password && <span className="erro">{errors.password}</span>}

          <span>
            <button className="login" onClick={handleSubmit}>Login</button>
            <span className="options">
              <button onClick={() => setView('forgot')}>Esqueci a senha</button>
              <button onClick={() => setView('register')}>Cadastre-se</button>
            </span>
          </span>
        </div>
      )}

      {view === 'forgot' && (
        <div className="auth-form">
          <label>Digite seu email cadastrado:</label>
          <input name="email" value={form.email} onChange={handleChange}/>
          {errors.email && <span className="erro">{errors.email}</span>}

          {message && <span className="info-msg">{message}</span>}

          <button className="login" onClick={handleForgotPassword}>Enviar link de recuperação</button>

          <span className="options">
            <button onClick={() => setView('login')}>Voltar ao login</button>
          </span>
        </div>
      )}

      {view === 'reset' && (
        <div className="auth-form">
          <label>Nova senha:</label>
          <div className="password-wrapper">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={form.password}
              onChange={handleChange}
            />
            <span className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
              <i className={`fi ${showPassword ? 'fi-sr-eye-crossed' : 'fi-rs-eye'}`}></i>
            </span>
          </div>
          {errors.password && <span className="erro">{errors.password}</span>}

          <label>Confirmar nova senha:</label>
          <input type="password" name="confirm_password" value={form.confirm_password} onChange={handleChange}/>
          {errors.confirm_password && <span className="erro">{errors.confirm_password}</span>}

          {message && <span className="info-msg">{message}</span>}

          <button className="login" onClick={handleResetPassword}>Redefinir senha</button>
        </div>
      )}

    </div>
  )
}

export default Auth
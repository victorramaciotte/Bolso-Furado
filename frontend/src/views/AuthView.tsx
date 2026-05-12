import { useState } from "react"
import { login, register} from "../services/authService"
import './AuthView.css'

interface Props {
  onLogin: (token: string, user: any) => void
}

function Auth({ onLogin }: Props) {
  const [isRegister, setIsRegister] = useState(false)

    const [form, setForm] = useState({
      name: '',
      email: '',
      password: '',
      confirm_password: ''
    })

    const [errors, setErrors] = useState({
      email: '',
      password: ''
    })

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
      setForm({ ...form, [e.target.name]: e.target.value })
    }

  async function handleSubmit() {
    let newErrors = {
      email: '',
      password: '',
      confirm_password: ''
    }

    if (!form.email) {
      newErrors.email = 'Digite seu email!'
    }

    if (!form.email.includes('@')) {
      newErrors.email = 'Email inválido'
    }
  
    if (!form.password) {
      newErrors.password = 'Digite sua senha!'
    }

    if (form.password.length < 6) {
      newErrors.password = 'A senha deve ter no mínimo 6 caracteres'
    }

    if (isRegister && form.password !== form.confirm_password) {
      newErrors.confirm_password = 'As senhas não coincidem'
    }

    setErrors(newErrors)
  
    // Se tiver erro, NÃO envia
    if (newErrors.email || newErrors.password) return
    
    try {
      if(isRegister){
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
        setErrors({ ...errors, password: 'Email ou senha incorretos' })
      }
    }
     
  
    
  }
    
    
 

  return (
    <div className="auth-wrapper">
      {isRegister ? 
        <div className="auth-form">
          <label>Nome:</label>
          <input name="name" value={form.name} onChange={handleChange}/>

          <label>Email:</label>
          <input name="email" value={form.email} onChange={handleChange}/>

          <label>Senha:</label>
          <input type="password" name="password" value={form.password} onChange={handleChange}/>

          <label>Repetir senha:</label>
          <input type="password" name="password" value={form.confirm_password} onChange={handleChange}/>

          
          <button className="login" onClick={handleSubmit}>Cadastrar</button>
          
          <span className="options">
            <button>Esqueci a senha</button>
            <button onClick={() => setIsRegister(false)}>Já possuo cadastro</button>
          </span>
        </div>


        : 
        <div className="auth-form">
          <label>Email:</label>
          <input name="email" value={form.email} onChange={handleChange}/>

          <label>Senha:</label>
          <input type="password" name="password" value={form.password} onChange={handleChange}/>

          <span>
            <button className="login" onClick={handleSubmit}>Login</button>
            <span className="options">
              <button>Esqueci a senha</button>
              <button onClick={() => setIsRegister(true)}>Cadastre-se</button>
            </span>
          </span>
        </div>
      }
    </div>
    
  )
}

export default Auth
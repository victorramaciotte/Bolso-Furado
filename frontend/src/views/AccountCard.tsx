import './AccountCard.css'

interface Props {
    user: {
        id: number
        name: string
        email: string
    }
}
export default function AccountCard({ user }: Props) {
  return (
    <div className='card-wrapper'>
        <span className='header-line'>
           <span className='profile-header'>{user.name}</span>
           <span className='triangle'></span> 
        </span>
        <div className='card'></div>
    </div>
  )
}

import './Components.css'

interface FABProps{
  onClick: () => void
}

function FAB({ onClick }: FABProps) {
  return (
    <button className="fab" onClick={onClick}>
      <i className="fi fi-br-plus"></i>
    </button>
  )
}

export default FAB
import './index.css'

const ProjectsCardList = props => {
  const {details} = props
  const {name, imageUrl} = details

  return (
    <li className="card-item-list">
      <img className="project-image" src={imageUrl} alt={name} />
      <p className="project-name">{name}</p>
    </li>
  )
}
export default ProjectsCardList

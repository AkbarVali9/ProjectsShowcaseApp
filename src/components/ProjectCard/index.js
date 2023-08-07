import './index.css'

const ProjectCard = props => {
  const {projectCardDetails} = props
  const {name, imageUrl} = projectCardDetails

  return (
    <li className="project-card-list-item">
      <img src={imageUrl} alt={name} className="project-card-image" />
      <p className="project-card-name">{name}</p>
    </li>
  )
}

export default ProjectCard

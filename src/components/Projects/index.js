import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Header from '../Header'
import ProjectCard from '../ProjectCard'

import './index.css'

// This is the list (static data) used in the application. You can move it to any component if needed.

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Projects extends Component {
  state = {
    projectsList: [],
    activeCategoryId: categoriesList[0].id,
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getAllProjects()
  }

  getAllProjects = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})

    const {activeCategoryId} = this.state
    const apiUrl = `https://apis.ccbp.in/ps/projects?category=${activeCategoryId}`
    const options = {method: 'GET'}

    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const data = await response.json()
      const updatedData = data.projects.map(eachProject => ({
        id: eachProject.id,
        name: eachProject.name,
        imageUrl: eachProject.image_url,
      }))
      this.setState({
        projectsList: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  onChangeCategory = event => {
    this.setState({activeCategoryId: event.target.value}, () =>
      this.getAllProjects(),
    )
  }

  onClickRetry = () => {
    this.getAllProjects()
  }

  renderProjectsView = () => {
    const {projectsList} = this.state
    return (
      <ul className="projects-container">
        {projectsList.map(eachProject => (
          <ProjectCard key={eachProject.id} projectCardDetails={eachProject} />
        ))}
      </ul>
    )
  }

  renderFailureView = () => (
    <div className="failureContainer">
      <img
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        alt="failure view"
        className="failure-image"
      />
      <h1 className="failure-heading">Oops! Something Went Wrong</h1>
      <p className="failure-info">
        We cannot seem to find the page you are looking for.
      </p>
      <button
        type="button"
        className="failure-retry-button"
        onClick={this.onClickRetry}
      >
        Retry
      </button>
    </div>
  )

  renderLoadingView = () => (
    <div data-testid="loader" className="loader-container">
      <Loader type="Circles" color="#00BFFF" height={80} width={80} />
    </div>
  )

  renderProjects = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderProjectsView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    const {activeCategoryId} = this.state

    return (
      <>
        <Header />
        <div className="bg-container">
          <select
            value={activeCategoryId}
            onChange={this.onChangeCategory}
            className="select-category-input"
          >
            {categoriesList.map(eachList => (
              <option key={eachList.id} value={eachList.id}>
                {eachList.displayText}
              </option>
            ))}
          </select>
          {this.renderProjects()}
        </div>
      </>
    )
  }
}

export default Projects

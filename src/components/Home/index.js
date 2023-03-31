import {Component} from 'react'
import Loader from 'react-loader-spinner'

import Header from '../Header'
import ProjectsCardList from '../ProjectsCardList'

import './index.css'

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

class Home extends Component {
  state = {
    projectsList: [],
    apiStatus: apiStatusConstants.initial,
    activeId: categoriesList[0].id,
  }

  componentDidMount() {
    this.getProjects()
  }

  onChangeCategory = event => {
    this.setState({activeId: event.target.value}, () => this.getProjects())
  }

  getProjects = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})

    const {activeId} = this.state

    const url = `https://apis.ccbp.in/ps/projects?category=${activeId}`
    const options = {
      method: 'GET',
    }
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok === true) {
      const updatedData = data.projects.map(each => ({
        id: each.id,
        name: each.name,
        imageUrl: each.image_url,
      }))
      this.setState({
        projectsList: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  clickRetry = () => {
    this.getProjects()
  }

  renderFailureView = () => (
    <div className="failure-container">
      <img
        className="failure-image"
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png "
        alt="failure view"
      />
      <h1 className="failure-heading">Oops! Something Went Wrong</h1>
      <p className="failure-para">
        We cannot seem to find the page you are looking for.
      </p>
      <button type="button" className="retry-button" onClick={this.clickRetry}>
        Retry
      </button>
    </div>
  )

  renderLoadingView = () => (
    <div data-testid="loader" className="loader">
      <Loader type="ThreeDots" color="#00BFFF" height={50} width={50} />
    </div>
  )

  renderProjectsView = () => {
    const {projectsList} = this.state

    return (
      <ul className="projects-list-container">
        {projectsList.map(each => (
          <ProjectsCardList key={each.id} details={each} />
        ))}
      </ul>
    )
  }

  renderAllProjects = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderProjectsView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    const {activeId} = this.state
    return (
      <div>
        <Header />
        <div className="bg-container">
          <select
            className="select-category"
            value={activeId}
            onChange={this.onChangeCategory}
          >
            {categoriesList.map(each => (
              <option value={each.id} key={each.id}>
                {each.displayText}
              </option>
            ))}
          </select>
          {this.renderAllProjects()}
        </div>
      </div>
    )
  }
}
export default Home

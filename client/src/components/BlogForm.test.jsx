import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'
import { render } from '../test-utils'

const { useBlogsMock } = vi.hoisted(() => ({
  useBlogsMock: vi.fn(),
}))

vi.mock('../hooks/useBlogs', () => ({
  useBlogs: useBlogsMock,
}))

const addBlogMock = vi.fn()

beforeEach(() => {
  addBlogMock.mockReset()
  useBlogsMock.mockReturnValue({
    isPending: false,
    addBlog: addBlogMock,
  })
})

describe('<BlogForm />', () => {
  test('when a new blog is created, the form calls the event handler it received as props with the right details', async () => {
    const user = userEvent.setup()

    render(<BlogForm />)

    const titleVal = "You're NOT gonna need it!"
    const authorVal = 'Ron Jeffries'
    const urlVal =
      'https://ronjeffries.com/xprog/articles/practices/pracnotneed'

    const title = screen.getByRole('textbox', { name: 'title' })
    const author = screen.getByRole('textbox', { name: 'author' })
    const url = screen.getByRole('textbox', { name: 'url' })
    const button = screen.getByRole('button')

    await user.type(title, titleVal)
    await user.type(author, authorVal)
    await user.type(url, urlVal)
    await user.click(button)

    expect(addBlogMock.mock.calls).toHaveLength(1)
    expect(addBlogMock.mock.calls[0][0].title).toBe(titleVal)
    expect(addBlogMock.mock.calls[0][0].author).toBe(authorVal)
    expect(addBlogMock.mock.calls[0][0].url).toBe(urlVal)
  })
})

import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import { render } from '../test-utils'
import { beforeEach, vi } from 'vitest'
import UserContext from '../UserContext'

const { useBlogsMock } = vi.hoisted(() => ({
  useBlogsMock: vi.fn(),
}))

vi.mock('../hooks/useBlogs', () => ({
  useBlogs: useBlogsMock,
}))

const likeMock = vi.fn()

beforeEach(() => {
  likeMock.mockReset()
  useBlogsMock.mockReturnValue({
    isPending: false,
    like: likeMock,
    removeBlog: vi.fn(),
    addComment: vi.fn(),
  })
})

const blog = {
  id: '69f9ba2cb4542c4a02214e76',
  title: "You're NOT gonna need it!",
  author: 'Ron Jeffries',
  url: 'https://ronjeffries.com/xprog/articles/practices/pracnotneed',
  likes: 123,
  user: {
    username: 'root',
    name: 'Superuser',
    id: '69f9ba1bb4542c4a02214e72',
  },
  comments: [],
}

describe('<Blog />', () => {
  test("renders the blog's information to unauthenticated users, buttons are not displayed", () => {
    render(<Blog blog={blog} />)

    const title = screen.getByText(`${blog.title}`)
    screen.debug(title)
    expect(title).toBeVisible()

    const author = screen.getByText(`by ${blog.author}`)
    expect(author).toBeVisible()

    const likes = screen.queryByText(`${blog.likes} likes`)
    expect(likes).toBeVisible()

    const url = screen.queryByRole('link', { name: blog.url })
    expect(url).toBeVisible()

    const like = screen.queryByRole('button', { name: 'like' })
    expect(like).toBeNull()

    const remove = screen.queryByRole('button', { name: 'remove' })
    expect(remove).toBeNull()
  })

  test("shows the blog's information and like button to authenticated users who are not the blog's creator", async () => {
    const newUser = {
      username: 'newuser',
      name: 'New User',
      id: '6a05808c6787740493d742fa',
    }
    render(
      <UserContext.Provider value={{ user: newUser, setUser: vi.fn() }}>
        <Blog blog={blog} />
      </UserContext.Provider>,
    )

    const title = screen.getByText(`${blog.title}`)
    screen.debug(title)
    expect(title).toBeVisible()

    const author = screen.getByText(`by ${blog.author}`)
    expect(author).toBeVisible()

    const likes = screen.queryByText(`${blog.likes} likes`)
    expect(likes).toBeVisible()

    const url = screen.queryByRole('link', { name: blog.url })
    expect(url).toBeVisible()

    const like = screen.queryByRole('button', { name: 'like' })
    expect(like).toBeVisible()

    const remove = screen.queryByRole('button', { name: 'remove' })
    expect(remove).toBeNull()
  })

  test("shows the blog's information, like, and remove buttons to the blog's creator", async () => {
    render(
      <UserContext.Provider value={{ user: blog.user, setUser: vi.fn() }}>
        <Blog blog={blog} />
      </UserContext.Provider>,
    )

    const title = screen.getByText(`${blog.title}`)
    screen.debug(title)
    expect(title).toBeVisible()

    const author = screen.getByText(`by ${blog.author}`)
    expect(author).toBeVisible()

    const likes = screen.queryByText(`${blog.likes} likes`)
    expect(likes).toBeVisible()

    const url = screen.queryByRole('link', { name: blog.url })
    expect(url).toBeVisible()

    const like = screen.queryByRole('button', { name: 'like' })
    expect(like).toBeVisible()

    const remove = screen.queryByRole('button', { name: 'remove' })
    expect(remove).toBeVisible()
  })

  test('after clicking like button twice, the event handler the component received as props is called twice', async () => {
    render(
      <UserContext.Provider value={{ user: blog.user, setUser: vi.fn() }}>
        <Blog blog={blog} />
      </UserContext.Provider>,
    )

    const user = userEvent.setup()
    const likeButton = screen.queryByRole('button', { name: 'like' })
    await user.click(likeButton)
    await user.click(likeButton)

    expect(likeMock.mock.calls).toHaveLength(2)
  })
})

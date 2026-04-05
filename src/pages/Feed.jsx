import React, { useEffect, useState } from 'react'
import api from '../api'
import { useAuth } from '../contexts/AuthContext'

export default function Feed() {
  const { logout } = useAuth()
  const [posts, setPosts] = useState([])
  const [text, setText] = useState('')
  const [image, setImage] = useState(null)
  const [loading, setLoading] = useState(false)

  const fetchFeed = async () => {
    try {
      const resp = await api.get('/feed')
      setPosts(resp.data?.data || resp.data || [])
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    fetchFeed()
  }, [])

  const handleCreate = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const form = new FormData()
      form.append('content', text)
      if (image) form.append('image', image)
      // visibility: public by default
      form.append('visibility', 'public')
      await api.post('/posts', form, { headers: { 'Content-Type': 'multipart/form-data' } })
      setText('')
      setImage(null)
      fetchFeed()
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const toggleLike = async (post) => {
    try {
      await api.post('/likes/toggle', { likeable_type: 'post', likeable_id: post.id })
      fetchFeed()
    } catch (e) { console.error(e) }
  }

  const submitComment = async (postId, content) => {
    try {
      await api.post('/comments', { post_id: postId, content })
      fetchFeed()
    } catch (e) { console.error(e) }
  }

  return (
    <div className="_layout _layout_main_wrapper">
      <nav className="navbar navbar-expand-lg navbar-light _header_nav _padd_t10">
        <div className="container _custom_container">
          <a className="navbar-brand" href="/feed"><img src="/assets/images/logo.svg" alt="Logo" className="_nav_logo"/></a>
          <div className="ms-auto d-flex align-items-center">
            <button className="btn btn-link" onClick={logout}>Logout</button>
          </div>
        </div>
      </nav>

      <div className="container _custom_container mt-4">
        <div className="row">
          <div className="col-md-8">
            <div className="card p-3 mb-4">
              <form onSubmit={handleCreate}>
                <textarea value={text} onChange={e=>setText(e.target.value)} placeholder="What's happening?" className="form-control mb-2" required />
                <input type="file" onChange={e=>setImage(e.target.files[0])} className="form-control mb-2" />
                <div className="d-flex gap-2">
                  <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Posting...' : 'Post'}</button>
                </div>
              </form>
            </div>

            {posts && posts.length === 0 && <p>No posts yet</p>}
            {posts && posts.map((p) => (
              <div key={p.id} className="card p-3 mb-3">
                <div className="d-flex justify-content-between">
                  <div>
                    <h6>{p.author?.name || p.author?.first_name || 'User'}</h6>
                    <small className="text-muted">{new Date(p.created_at || p.createdAt || Date.now()).toLocaleString()}</small>
                  </div>
                  <div>
                    <button className="btn btn-sm btn-outline-primary" onClick={()=>toggleLike(p)}>{p.liked ? 'Unlike' : 'Like'} ({p.likes_count || p.likes || 0})</button>
                  </div>
                </div>
                <p className="mt-2">{p.content || p.text}</p>
                {p.image_url && <img src={p.image_url} alt="post" style={{maxWidth:'100%'}} />}
                <div className="mt-2">
                  <CommentList comments={p.comments || []} postId={p.id} onSubmit={submitComment} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function CommentList({ comments, postId, onSubmit }) {
  const [text, setText] = useState('')
  return (
    <div>
      <div>
        {comments && comments.map(c => (
          <div key={c.id} className="border p-2 mb-2">
            <strong>{c.author?.name || 'User'}</strong>
            <p>{c.content}</p>
          </div>
        ))}
      </div>
      <form onSubmit={e => { e.preventDefault(); onSubmit(postId, text); setText('') }}>
        <div className="d-flex gap-2">
          <input value={text} onChange={e=>setText(e.target.value)} className="form-control" placeholder="Write a comment" required />
          <button className="btn btn-sm btn-primary">Comment</button>
        </div>
      </form>
    </div>
  )
}

import React, { useState } from 'react'
import { useSubjects } from '../../hooks/useSubjects'

function SubjectForm() {
  const { addSubject } = useSubjects()
  const [name, setName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async event => {
    event.preventDefault()
    if (!name.trim()) return
    setIsSubmitting(true)
    try {
      await addSubject(name.trim())
      setName('')
    } catch (error) {
      console.error('Failed to add subject:', error)
      alert('Could not add subject. Check console for details.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="subject-form-flex">
      <input
        className="input"
        type="text"
        placeholder="Add a subject (e.g. Linear Algebra)"
        value={name}
        onChange={event => setName(event.target.value)}
      />
      <button className="primary-button" type="submit" disabled={isSubmitting}>
        Add
      </button>
    </form>
  )
}

export default SubjectForm


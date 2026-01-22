import React, { useState } from 'react'
import { useTasks } from '../../hooks/useTasks'
import { useSubjects } from '../../hooks/useSubjects'

function TaskForm() {
  const { addTask } = useTasks()
  const { subjects, addSubject } = useSubjects()
  const [title, setTitle] = useState('')
  const [subjectId, setSubjectId] = useState('')
  const [deadline, setDeadline] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubjectChange = async event => {
    const value = event.target.value
    if (value === 'new') {
      const name = prompt('Enter new subject name:')
      if (name && name.trim()) {
        try {
          // We need the ID of the newly created subject. 
          // Since addSubject is async and might not return the ID directly depending on implementation,
          // we might need to rely on the fact that useSubjects refreshes.
          // But for now, let's just add it. Ideally addSubject should return the ref or ID.
          // Looking at useSubjects.js, addSubject is void promise.
          // We'll just add it and let the user select it, or improve useSubjects later.
          // Actually, useSubjects optimistic update adds a temp ID. 
          await addSubject(name.trim())
          // We can't easily auto-select the new ID without changing addSubject return type.
          // For now, we'll just reset to empty or let them pick it from the list (which will update).
        } catch (error) {
          alert('Failed to create subject')
        }
      }
      setSubjectId('') // Reset selection
    } else {
      setSubjectId(value)
    }
  }

  const handleSubmit = async event => {
    event.preventDefault()
    if (!title.trim()) return
    setIsSubmitting(true)
    try {
      await addTask({
        title: title.trim(),
        subjectId: subjectId || null,
        deadline: deadline || null,
      })
      setTitle('')
      setDeadline('')
    } catch (error) {
      console.error('Failed to add task:', error)
      alert('Could not add task. Check console for details.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="task-form-grid"
    >
      <input
        className="input"
        type="text"
        placeholder="New task (e.g. Review chapter 3 problems)"
        value={title}
        onChange={event => setTitle(event.target.value)}
      />
      <select
        className="input"
        value={subjectId}
        onChange={handleSubjectChange}
      >
        <option value="">No subject</option>
        {subjects.map(subject => (
          <option key={subject.id} value={subject.id}>
            {subject.name}
          </option>
        ))}
        <option value="new" style={{ fontWeight: 'bold', color: '#22c55e' }}>
          + Create new subject
        </option>
      </select>
      <input
        className="input"
        type="date"
        value={deadline}
        onChange={event => setDeadline(event.target.value)}
      />
      <button className="primary-button" type="submit" disabled={isSubmitting}>
        Add
      </button>
    </form>
  )
}

export default TaskForm


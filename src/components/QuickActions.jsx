import { useNavigate } from 'react-router-dom';
import './QuickActions.css';

const QuickActions = ({ actions = [], onActionClick }) => {
  const navigate = useNavigate();
  
  const defaultActions = [
    {
      id: 'add-relative',
      label: 'Add Relative',
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 4V16M4 10H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <circle cx="10" cy="7" r="2" stroke="currentColor" strokeWidth="1.5" fill="none"/>
        </svg>
      ),
      route: '/add-family-member',
    },
    {
      id: 'upload-photos',
      label: 'Upload Photos',
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="3" y="5" width="14" height="11" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none"/>
          <circle cx="7" cy="9" r="1.5" fill="currentColor"/>
          <path d="M3 13L6 10L9 13L13 9L17 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      route: '/upload-photos',
    },
    {
      id: 'message-family',
      label: 'Message Family',
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 5C3 3.89543 3.89543 3 5 3H15C16.1046 3 17 3.89543 17 5V12C17 13.1046 16.1046 14 15 14H7L3 17V5Z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
        </svg>
      ),
      route: '/messages',
    },
    {
      id: 'join-tree',
      label: 'Join a Tree',
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 3V8M10 8C8.34315 8 7 9.34315 7 11V17M10 8C11.6569 8 13 9.34315 13 11V17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          <circle cx="10" cy="3" r="1.5" fill="currentColor"/>
          <circle cx="7" cy="17" r="1.5" fill="currentColor"/>
          <circle cx="13" cy="17" r="1.5" fill="currentColor"/>
        </svg>
      ),
      route: '/join-tree',
    },
  ];

  const displayActions = actions.length > 0 ? actions : defaultActions;

  const handleClick = (action) => {
    if (onActionClick) {
      onActionClick(action.id);
    } else if (action.route) {
      navigate(action.route);
    }
  };

  return (
    <section className="dashboard-section">
      <h2>Quick Actions</h2>
      <div className="quick-actions-grid">
        {displayActions.map((action) => (
          <button
            key={action.id}
            className="quick-action-button"
            onClick={() => handleClick(action)}
            aria-label={action.label}
          >
            <div className="quick-action-icon">{action.icon}</div>
            <span className="quick-action-label">{action.label}</span>
          </button>
        ))}
      </div>
    </section>
  );
};

export default QuickActions;

import { NavLink } from 'react-router-dom';
import styles from './Sidebar.module.css';

interface Project { id: string; name: string; color: string; }
interface SidebarProps {
  projects: Project[];
  isOpen: boolean;
  onRename?: (project: Project) => void;
  onDelete?: (projectId: string) => void;
}

export default function Sidebar({ projects, isOpen, onRename, onDelete }: SidebarProps) {
  return (
    <aside className={`${styles.sidebar} ${isOpen ? styles.open : styles.closed}`}>
      <h2 className={styles.title}>Mes Projets</h2>
      <ul className={styles.list}>
        {projects.map(p => (
          <li key={p.id} className={styles.item}>
            <NavLink
              to={`/projects/${p.id}`}
              className={({ isActive }) =>
                `${styles.link} ${isActive ? styles.active : ''}`
              }
            >
              <span className={styles.dot} style={{ background: p.color }} />
              {p.name}
            </NavLink>
            <div className={styles.actions}>
              {onRename && (
                <button
                  type="button"
                  className={styles.actionBtn}
                  onClick={() => onRename(p)}
                  aria-label={`Renommer ${p.name}`}
                >
                  ✏️
                </button>
              )}
              {onDelete && (
                <button
                  type="button"
                  className={styles.actionBtn}
                  onClick={() => onDelete(p.id)}
                  aria-label={`Supprimer ${p.name}`}
                >
                  🗑️
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </aside>
  );
}

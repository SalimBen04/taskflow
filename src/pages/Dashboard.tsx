import { useState, useEffect } from 'react';
import axios from 'axios';

import { useAuth } from '../features/auth/AuthContext';
import api from '../api/axios';

import Header from '../components/HeaderMUI';
import Sidebar from '../components/Sidebar';
import MainContent from '../components/MainContent';
import ProjectForm from '../components/ProjectForm';

import styles from './Dashboard.module.css';
import HeaderMUI from '../components/HeaderMUI';


interface Project {
  id: string;
  name: string;
  color: string;
}

interface Column {
  id: string;
  title: string;
  tasks: string[];
}


export default function Dashboard() {

  const { state: authState, dispatch } = useAuth();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [columns, setColumns] = useState<Column[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  // partie 9
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);


  // GET
  useEffect(() => {

    async function fetchData() {

      try {

        const [projRes, colRes] = await Promise.all([
          api.get('/projects'),
          api.get('/columns'),
        ]);

        setProjects(projRes.data);
        setColumns(colRes.data);

      } catch (e) {

        console.error(e);

      } finally {

        setLoading(false);

      }

    }

    fetchData();

  }, []);


  // POST
  async function addProject(name: string, color: string) {

    setSaving(true);
    setError(null);

    try {

      const { data } = await api.post('/projects', {
        name,
        color,
      });

      setProjects(prev => [...prev, data]);

    } catch (err) {

      if (axios.isAxiosError(err)) {

        setError(
          err.response?.data?.message ||
          `Erreur ${err.response?.status}`
        );

      } else {

        setError('Erreur inconnue');

      }

    } finally {

      setSaving(false);

    }

  }


  // PUT
  async function renameProject(project: Project) {

    const newName = prompt('Nouveau nom :', project.name);

    if (!newName || newName === project.name) return;

    try {

      const { data } = await api.put(
        '/projects/' + project.id,
        { ...project, name: newName }
      );

      setProjects(prev =>
        prev.map(p =>
          p.id === project.id ? data : p
        )
      );

    } catch {

      setError('Erreur rename');

    }

  }


  // DELETE
  async function deleteProject(id: string) {

    const ok = confirm('Êtes-vous sûr ?');

    if (!ok) return;

    try {

      await api.delete('/projects/' + id);

      setProjects(prev =>
        prev.filter(p => p.id !== id)
      );

    } catch {

      setError('Erreur delete');

    }

  }


  if (loading) {

    return (
      <div className={styles.loading}>
        Chargement...
      </div>
    );

  }


  return (

    <div className={styles.layout}>

      <HeaderMUI
        title="TaskFlow"
        onMenuClick={() => setSidebarOpen(p => !p)}
        userName={authState.user?.name}
        onLogout={() => dispatch({ type: 'LOGOUT' })}
      />


      <div className={styles.body}>


        <Sidebar
          projects={projects}
          isOpen={sidebarOpen}
        />


        <div className={styles.content}>


          {/* erreur */}
          {error && (
            <div className={styles.error}>
              {error}
            </div>
          )}


          <div className={styles.toolbar}>


            {!showForm ? (

              <button
                className={styles.addBtn}
                disabled={saving}
                onClick={() => setShowForm(true)}
              >
                + Nouveau projet
              </button>

            ) : (

              <ProjectForm

                submitLabel="Créer"

                onSubmit={(name, color) => {
                  addProject(name, color);
                  setShowForm(false);
                }}

                onCancel={() => setShowForm(false)}

              />

            )}


          </div>


          <MainContent columns={columns} />


        </div>


      </div>


    </div>

  );

}
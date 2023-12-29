import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import classNames from 'classnames';
import { API_ENDPOINTS } from '../../config/apiConfig';

export default function Sidebar() {
  const [userData, setUserData] = useState(null);
  const [expandedModule, setExpandedModule] = useState(null);
  const router = useRouter();

  const isActive = useCallback((path) => {
    return router.pathname === path;
  }, [router.pathname]);

  const fetchUserData = useCallback((userId) => {
    fetch(API_ENDPOINTS.GET_USER_BY_ID(userId))
      .then(response => response.json())
      .then(data => {
        setUserData(data);
      })
      .catch(error => {
        console.error('Error fetching user data:', error);
      });
  }, []);

  useEffect(() => {
    const userId = Cookies.get('userId');
    if (userId) {
      fetchUserData(userId);
    }
  }, [fetchUserData]);

  const toggleModule = useCallback((moduleId) => {
    setExpandedModule(prevModuleId => prevModuleId === moduleId ? null : moduleId);
  }, []);


  return (
    <aside className="w-64 bg-gray-700 text-gray-100">
      <div className="px-3 py-4">
        <nav className="flex flex-col space-y-2">
          {userData?.roles?.map((role) =>
            role.modules.map((module) => (
              <div key={module.id}>
                <button
                  onClick={() => toggleModule(module.id)}
                  className={classNames(
                    'w-full text-left flex items-center justify-between px-3 py-1 rounded transition-colors duration-200 ease-in-out',
                    {
                      'bg-gray-600': expandedModule === module.id,
                      'hover:bg-gray-600': true,
                    }
                  )}
                  aria-expanded={expandedModule === module.id}
                >
                  <span className="text-size-normal">{module.moduleName}</span>
                  <span>{expandedModule === module.id ? '↓' : '→'}</span>
                </button>
                <div
                  className={classNames(
                    'pl-6 transition-max-height duration-300 ease-in-out',
                    {
                      'module-expanded': expandedModule === module.id,
                      'module-collapsed': expandedModule !== module.id,
                    }
                  )}
                >
                  {module.programs.map((program) => (
                    <Link key={program.id} href={program.path ? `/${program.path}` : '#'} legacyBehavior>
                    <a 
                      className={classNames(
                        'block px-3 py-1 mt-1 rounded transition-colors duration-200 ease-in-out text-size-normal',
                        { 'bg-gray-600': isActive(program.path), 'hover:bg-gray-600': true }
                      )}
                    >
                      {program.title}
                    </a>
                  </Link>
                  ))}
                </div>
              </div>
            ))
          )}
        </nav>
      </div>
    </aside>
  );
}

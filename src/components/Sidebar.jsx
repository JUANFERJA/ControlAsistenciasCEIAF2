import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { generalFunctions } from '../helpers/generalFunctions';
import { DataContext } from '../context/DataContext';


const { generarContenido } = generalFunctions();

export const Sidebar = ({ isOpen, onClose }) => {
  const { menus, setMenus } = useContext(DataContext);
  const [expandedMenus, setExpandedMenus] = useState({});

  const menuList = Array.isArray(menus) ? menus : [];
  const menuFirstLevel = menuList.filter((m) => Number(m.parentId) === 0);

  useEffect(() => {
    let urlMenu = `Menus/obtener-menus`;
    generarContenido(setMenus, urlMenu);
  }, []);

  const toggleMenu = (id) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleNavigate = () => {
    if (onClose) onClose();
  };

  return (
    <>
      <div
        className={`sidebar-overlay ${isOpen ? 'visible' : ''}`}
        onClick={onClose}
        aria-hidden={!isOpen}
      />

      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="side-header">
          <div className="side-label">Navegación</div>
          <button type="button" className="sidebar-close" onClick={onClose} aria-label="Cerrar menú">
            ✕
          </button>
        </div>

        <div className="side-section">
          <div className="menu-list">
            {menuFirstLevel.map((item) => {
              const subMenus = menuList.filter((m) => Number(m.parentId) === Number(item.id));
              const hasSubmenu = subMenus.length > 0;
              const isOpenMenu = expandedMenus[item.id] ?? true;

              if (hasSubmenu) {
                return (
                  <div className="accordion-item" key={item.id}>
                    <button
                      type="button"
                      className={`accordion-trigger ${isOpenMenu ? 'open' : ''}`}
                      onClick={() => toggleMenu(item.id)}
                    >
                      <span className="trigger-label">
                        <span className="bullet" />
                        {item.name}
                      </span>
                      <span className="chevron">{isOpenMenu ? '▾' : '▸'}</span>
                    </button>

                    {isOpenMenu && (
                      <div className="accordion-content">
                        {subMenus.map((subMenu) => (
                          <Link to={subMenu.url || '#'} key={subMenu.id} className="submenu-link" onClick={handleNavigate}>
                            <span className="bullet small" />
                            {subMenu.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link to={item.url || '#'} key={item.id} className="menu-item" onClick={handleNavigate}>
                  <span className="bullet" />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>
      </aside>
    </>
  );
};

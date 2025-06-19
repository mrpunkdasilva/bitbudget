import './styles.scss';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer__content">
        <div className="footer__logo">
          <img src="/favicon.svg" alt="BitBudget Logo" className="footer__logo-img" />
          <span className="footer__logo-text">BitBudget</span>
        </div>

        <div className="footer__links">
          <div className="footer__links-column">
            <h3 className="footer__links-title">Recursos</h3>
            <ul className="footer__links-list">
              <li>
                <a href="#" className="footer__link">
                  Dashboard
                </a>
              </li>
              <li>
                <a href="#" className="footer__link">
                  Relatórios
                </a>
              </li>
              <li>
                <a href="#" className="footer__link">
                  Categorias
                </a>
              </li>
              <li>
                <a href="#" className="footer__link">
                  Metas
                </a>
              </li>
            </ul>
          </div>

          <div className="footer__links-column">
            <h3 className="footer__links-title">Suporte</h3>
            <ul className="footer__links-list">
              <li>
                <a href="#" className="footer__link">
                  Ajuda
                </a>
              </li>
              <li>
                <a href="#" className="footer__link">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="footer__link">
                  Contato
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="footer__bottom">
        <div className="footer__copyright">
          &copy; {currentYear} BitBudget. Todos os direitos reservados.
        </div>
        <div className="footer__social">
          <a href="#" className="footer__social-link">
            <span className="footer__social-icon">🐦</span>
          </a>
          <a href="#" className="footer__social-link">
            <span className="footer__social-icon">📷</span>
          </a>
          <a href="#" className="footer__social-link">
            <span className="footer__social-icon">📘</span>
          </a>
        </div>
      </div>

      <div className="footer__pixel-border"></div>
    </footer>
  );
};

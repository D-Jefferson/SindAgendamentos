import React from "react";
import { FileText } from "lucide-react";
import "../../styles/agendar.css";

interface TermsPopupProps {
  onClose: () => void;
}

export default function TermsPopup({ onClose }: TermsPopupProps) {
  return (
    <div className="popup-overlay">
      <div className="popup-container">
        <div className="popup-content">
          <div className="popup-icon">
            <FileText size={32} />
          </div>
          <h2 className="popup-title">Termos e Condições & LGPD</h2>

          <div className="popup-message termos-texto">
            <p>
              Ao utilizar este sistema, você concorda com os{" "}
              <strong>Termos e Condições</strong> de uso, que definem as regras
              para utilização da plataforma, responsabilidades e limitações.
            </p>
            <p>
              Em conformidade com a{" "}
              <strong>Lei Geral de Proteção de Dados (LGPD)</strong>, seus dados
              pessoais serão coletados e tratados apenas para fins relacionados
              ao agendamento de serviços, respeitando a confidencialidade e
              segurança.
            </p>
            <p>
              Você tem o direito de solicitar a correção, exclusão ou acesso aos
              seus dados pessoais a qualquer momento, conforme previsto na lei.
            </p>
          </div>

          <button
            onClick={onClose}
            className="popup-button popup-button-enabled"
          >
            Li e Concordo
          </button>
        </div>
      </div>
    </div>
  );
}

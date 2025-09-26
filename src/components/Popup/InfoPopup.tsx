import React from "react";
import { FileText } from "lucide-react";
import "../../styles/agendar.css";

interface InfoPopupProps {
  canClose: boolean;
  onClose: () => void;
}

export default function InfoPopup({ canClose, onClose }: InfoPopupProps) {
  return (
    <div className="popup-overlay">
      <div className="popup-container">
        <div className="popup-content">
          <div className="popup-icon">
            <FileText size={32} />
          </div>

          <h2 className="popup-title">Informações Importantes</h2>

          <div className="popup-message">
            <p className="popup-text">
              Para realizar seu agendamento, é necessário preencher <strong>todas as informações corretamente</strong>.
            </p>
            <p className="popup-text popup-highlight">
              O <strong>e-mail é de suma importância</strong> para confirmação e comunicação sobre seu agendamento.
            </p>
            <p className="popup-text">
              Permita a <strong>localização do seu dispositivo</strong> para facilitar o preenchimento da cidade.
            </p>
            <p className="popup-text">
              Certifique-se de que todos os dados estão corretos antes de confirmar.
            </p>
          </div>

          <button
            onClick={onClose}
            disabled={!canClose}
            className={`popup-button ${canClose ? "popup-button-enabled" : "popup-button-disabled"}`}
          >
            {canClose ? "OK, Entendi" : "Aguarde..."}
          </button>

          {!canClose && (
            <div className="popup-timer">
              <div className="timer-bar"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface AlertProps {
  type: 'error' | 'success' | 'info';
  message: string;
  onClose?: () => void;
}

const styles = {
  error: 'bg-red-50 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-200 dark:border-red-800',
  success:
    'bg-green-50 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-200 dark:border-green-800',
  info: 'bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-200 dark:border-blue-800',
};

export const Alert = ({ type, message, onClose }: AlertProps) => (
  <div className={`flex items-center justify-between rounded-lg border px-4 py-3 text-sm ${styles[type]}`}>
    <span>{message}</span>
    {onClose && (
      <button onClick={onClose} className="ml-4 opacity-70 hover:opacity-100" aria-label="Dismiss">
        ×
      </button>
    )}
  </div>
);

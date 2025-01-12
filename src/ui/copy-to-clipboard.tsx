import React from 'react';
import {toast} from "@/components/ui/use-toast";
import {ToastAction} from "@/components/ui/toast";

interface CopyToClipboardProps {
  text: any; // Allows any type of data to be passed and converted to string for copying
  children: React.ReactNode;
}

const CopyToClipboard: React.FC<CopyToClipboardProps> = ({ text, children }) => {
  const handleCopy = () => {
    const textToCopy = String(text); // Converts text to a string for compatibility
    navigator.clipboard.writeText(textToCopy)
      .then(() => toast({
        title: "Lien généré",
        description: `${text}`,})
      )
      .catch(() => toast({
        title: "Echec",
        description: `Erreur lors de la copie`,
        action: <ToastAction altText="Reesayer" onClick={()=>{handleCopy()}}>Reesayer</ToastAction>,
      }));
  };

  return (
    <div onClick={handleCopy} className="cursor-pointer">
      {children}
    </div>
  );
};

export default CopyToClipboard;

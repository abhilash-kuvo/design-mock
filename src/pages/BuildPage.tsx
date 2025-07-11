interface BuildPageProps {
   onSubmit: (query: string) => void;
   onNewPlaybook: () => void;
   onMyPlaybooks: () => void;
}

const BuildPage: React.FC<BuildPageProps> = ({ 
  onSubmit, 
  onNewPlaybook,
  onMyPlaybooks
}) => {
};

export default BuildPage;
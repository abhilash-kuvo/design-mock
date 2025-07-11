@@ .. @@
-interface AgentRunPageProps {
+interface BuildPageProps {
   onSubmit: (query: string) => void;
   onNewPlaybook: () => void;
   onMyPlaybooks: () => void;
@@ .. @@
 }
 
-const AgentRunPage: React.FC<AgentRunPageProps> = ({ 
+const BuildPage: React.FC<BuildPageProps> = ({ 
   onSubmit, 
   onNewPlaybook, 
@@ .. @@
 };
 
-export default AgentRunPage;
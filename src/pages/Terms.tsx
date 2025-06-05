
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Terms = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div className="prose prose-gray dark:prose-invert max-w-none">
          <h1>Terms of Service</h1>
          
          <p><strong>Last Updated:</strong> 05/06/2025</p>

          <p><strong>1. Acceptance of Terms:</strong> These Terms of Service ("Terms") govern your use of OneLine, a web application owned by a company registered in Tunisia ("OneLine", "we", "us"). By accessing or using OneLine, you agree to abide by these Terms and all applicable laws and regulations. If you do not agree, do not use the App. Users must be at least <strong>13 years old</strong>. Processing personal data of a child under 13 is only lawful with parental consent.</p>

          <p><strong>2. Eligibility:</strong> You must be 13 years or older to register for OneLine. By creating an account, you represent and warrant that you are at least 16 and have the legal capacity to enter into these Terms. You must provide accurate registration data (name, email). You are responsible for keeping your account credentials secure.</p>

          <p><strong>3. User Conduct:</strong> You agree <strong>not</strong> to use the App for unlawful or prohibited activities. In particular, you must not post or transmit:</p>

          <ul>
            <li><strong>Harassing or hateful content:</strong> You may not use OneLine to harass, threaten, abuse, stalk, intimidate or defame others. Content that vilifies or incites hatred against any group or individual is prohibited.</li>
            <li><strong>Illegal content:</strong> Any content that violates laws (e.g. hate speech laws, defamation, copyright infringement, fraud, or trafficking in illicit goods) is forbidden. Do not upload malware, spam, or other malicious code.</li>
            <li><strong>Discriminatory/offensive material:</strong> Posts that are obscene, pornographic, violent, discriminatory, or promote self-harm are not allowed. Respect others' rights and privacy.</li>
            <li><strong>Any content violating rights:</strong> You must not infringe intellectual property, privacy, or any rights of others.</li>
          </ul>

          <p>We may, at our discretion, refuse, remove or disable content that violates these rules or is otherwise objectionable. We reserve the right to suspend or terminate user accounts for violations, with or without notice. These conduct rules enable us to moderate content and protect the community.</p>

          <p><strong>4. User Content and License:</strong> OneLine allows you to create and submit short text entries ("Submissions"). You retain ownership of any content you post, but by uploading it you grant OneLine a <strong>perpetual, worldwide, non-exclusive, royalty-free license</strong> to use, reproduce, display, modify, and distribute your Submissions in connection with operating and promoting the App. This license continues even if you stop using OneLine. You represent that you have all rights to your content. We do not assume liability for your Submissions; you are solely responsible for them.</p>

          <p><strong>5. Privacy and Data Usage:</strong> We collect your name, email, usage data (e.g. session logs, analytics), and any Submissions you post. This is detailed in our Privacy Policy. By using OneLine, you consent to such collection, storage and use.</p>

          <p><strong>6. Disclaimers and Limitation of Liability:</strong> ONE LINE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES. We disclaim all warranties (express or implied) of merchantability, fitness for purpose, or non-infringement. We do not guarantee the service will be uninterrupted or error-free. We expressly disclaim liability for any loss or damage from your use of OneLine or from any content posted by users. We are not responsible for the accuracy, reliability or legality of user-generated Submissions. In no event will OneLine or its affiliates be liable for indirect, incidental, or consequential damages.</p>

          <p><strong>7. Updates and Termination:</strong> We may modify these Terms at any time by posting the updated Terms on OneLine; your continued use constitutes acceptance. We reserve the right to modify or discontinue the App or any features at our discretion. We may suspend or terminate your access if you violate any Terms or for any lawful reason.</p>

          <p><strong>8. Governing Law:</strong> These Terms are governed by Tunisian law, as OneLine is registered in Tunisia. Any dispute will be subject to the jurisdiction of Tunisian courts.</p>

          <p><strong>9. Contact:</strong> For questions about the Terms, you may contact OneLine via oneline.webapp@gmail.com.</p>
        </div>
      </div>
    </div>
  );
};

export default Terms;

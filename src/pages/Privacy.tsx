
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Privacy = () => {
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
          <h1>Privacy Policy</h1>
          
          <p><strong>Last Updated:</strong> 05/06/2025</p>

          <p>OneLine ("we", "us") is committed to protecting your privacy. This Privacy Policy explains what information we collect, how we use it, and your rights. We comply with Tunisian data protection law and applicable international standards (including the EU General Data Protection Regulation, GDPR).</p>

          <p><strong>1. Information We Collect:</strong> When you sign up for OneLine, we collect:</p>

          <ul>
            <li><strong>Personal Information:</strong> Your name and email address (required for account creation).</li>
            <li><strong>User Content:</strong> The short text entries ("lines") or other content you post.</li>
            <li><strong>Usage Data:</strong> Information about how you use OneLine (e.g. IP address, device type, browser, pages visited, time stamps). We use cookies or similar technologies (via services like Vercel Analytics or Google Analytics) to collect usage data.</li>
          </ul>

          <p><strong>2. How We Use Information:</strong> We use your information to:</p>

          <ul>
            <li>Provide, maintain and improve the App (including security, troubleshooting, and content moderation).</li>
            <li>Manage your account and authenticate users (using Supabase for authentication).</li>
            <li>Analyze usage patterns to optimize performance (using analytics tools).</li>
            <li>Communicate with you about updates or support.</li>
          </ul>

          <p>We do <strong>not</strong> sell your personal data. We share information only with trusted third-party service providers as needed (e.g. hosting providers, analytics, and authentication services). These providers are bound to protect your data and use it only for OneLine's purposes.</p>

          <p><strong>3. Data Sharing and Disclosure:</strong></p>

          <ul>
            <li>We may disclose personal data if required by law, or to protect rights or comply with legal processes.</li>
            <li>We use third-party platforms (e.g. Vercel for hosting, Supabase for auth, analytics services) which may process data. Under Google Analytics policy, for example, sites must disclose analytics use. We have done so here.</li>
            <li>Your Submissions may be visible to other users. OneLine is not responsible for how other users use your public content.</li>
          </ul>

          <p><strong>4. Data Retention:</strong> We retain your personal data only as long as necessary for the purposes set out above (account maintenance, legal compliance, security). In line with GDPR's storage limitation principle, we do not keep personal data longer than needed. When data is no longer necessary, we securely delete or anonymize it.</p>

          <p><strong>5. Your Privacy Rights:</strong> You have certain rights regarding your personal data under GDPR and Tunisian law:</p>

          <ul>
            <li><strong>Access & Correction:</strong> You can request access to the personal data we hold about you, and ask to correct or update any inaccuracies.</li>
            <li><strong>Erasure (Right to be Forgotten):</strong> You may request deletion of your account and personal data, subject to any legal obligations.</li>
            <li><strong>Restriction & Objection:</strong> You have the right to restrict or object to certain processing activities (e.g., direct marketing).</li>
            <li><strong>Portability:</strong> You can request a copy of your data in a portable format.</li>
            <li><strong>Withdraw Consent:</strong> If processing is based on consent, you can withdraw consent at any time without affecting prior processing.</li>
            <li><strong>Complaints:</strong> You have the right to lodge a complaint with a data protection authority (e.g. the Tunisian INPDP or an EU supervisory authority) if you believe your data is mishandled.</li>
          </ul>

          <p>To exercise these rights, contact us via the details below. We will respond within the time frames required by law.</p>

          <p><strong>6. Children's Privacy:</strong> OneLine is not intended for users under 13. If we learn we have collected data from a child under 13 without parental consent, we will delete it.</p>

          <p><strong>7. International Transfers:</strong> OneLine is accessible globally. Your data may be transferred to, stored, and processed in Tunisia or other countries where our service providers operate. We will take steps to ensure that any international transfer complies with applicable data protection laws (e.g. using EU Standard Contractual Clauses if EU data is transferred to non-adequate jurisdictions) as required by GDPR.</p>

          <p><strong>8. Data Security:</strong> We implement reasonable technical and organizational measures (encryption, access controls, etc.) to protect your data. As required by Tunisian law, we work to prevent unauthorized access or breaches. However, no security is perfect and we cannot guarantee absolute security.</p>

          <p><strong>9. Cookies:</strong> We use cookies or similar tracking technologies on our website and app for authentication and analytics. You can control cookie settings via your browser.</p>

          <p><strong>10. Changes to Policy:</strong> We may update this Privacy Policy. The "Last Updated" date above reflects the effective date. We will notify you of significant changes (e.g. by posting an announcement).</p>

          <p><strong>11. Contact Information:</strong> If you have questions about privacy or wish to exercise your rights, please contact us at OneLine oneline.webapp@gmail.com.</p>

          <p><strong>12. GDPR Compliance Notice:</strong> As required by GDPR Article 13, we have provided you with information on the identity of the data controller (OneLine in Tunisia), the purposes of processing, data recipients (service providers), data retention periods, and your rights to access, rectification, erasure, restriction, portability, objection, and to lodge a complaint.</p>

          <p>By using OneLine, you consent to the practices described in these Terms and Privacy Policy.</p>
        </div>
      </div>
    </div>
  );
};

export default Privacy;

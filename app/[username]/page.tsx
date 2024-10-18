"use client"

import React from "react";
import { useParams } from 'next/navigation'
import { UserProvider, useUser } from "../_providers/user";
import { hexToHSL } from "../_utils/color-converter";
import { IUserInApp } from "../_interfaces/user";
import { IProfileSection } from "../_interfaces/profile-section";

// Components
import Hero from "./components/hero/";
import Bio from "./components/bio/";
import Section from "./components/section";
import getUserByUsername from "../_services/get-user-by-username";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import EditProfileButton from "./components/admin/edit-profile-button";
import { isAdmin } from "../_services/check-user-is-admin";
import useProfileSections from "../_shared/hooks/use-profile-sections";

const App = () => {
    const { username } = useParams();
    const { user } = getUserByUsername(username as string);

    if (!user) return <UserNotFound />;

    return (
        <UserProvider user={user}>
            <ProfilePage />
        </UserProvider>
    );
};

const UserNotFound = () => (
    <div className="w-full h-screen flex items-center justify-center">
        <h1 className="text-xl font-semibold">Usuário não encontrado</h1>
    </div>
);

const ProfilePage = () => {
    const u = useUser();


    // passando o status de admin para o corpo do usuario
    const user = { ...u, isAdmin: isAdmin(u) };

    const { profileSections, menuItems } = useProfileSections(user);

    return (
        <div className="w-full" >
            <Hero menuItems={menuItems} user={user} />
            <Details user={user} sections={profileSections} />
            {user.isAdmin && <EditProfileButton className="fixed bottom-4 right-4" user={user} />}
        </div>
    );
};

const Details = React.memo(({ user, sections }: { user: IUserInApp, sections: IProfileSection[] }) => (
    <div
        style={{ "--primary": hexToHSL(user.theme.primaryColor!) } as React.CSSProperties}
        className="px-6 py-10 flex flex-col items-center justify-center gap-10 -mt-24 z-30 relative max-w-3xl mx-auto"
    >
        <Bio bio={user.bio} />
        {sections.map((section, index) =>
            section.component && (
                <AnimatedSection key={index} section={section} index={index} />
            )
        )}
    </div>
));

const AnimatedSection = ({ section, index }: { section: IProfileSection, index: number }) => {
    const [ref, inView] = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.2 * index }}
            className="w-full"
        >
            <Section name={section.title} id={section.link.substring(1)}>
                {section.component}
            </Section>
        </motion.div>
    );
};

Details.displayName = 'Details';

export default App;

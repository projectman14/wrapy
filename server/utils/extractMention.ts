export const extractMentions = (content: string): string[] => {
    const regex = /@(\w+)/g;
    const matches = [...content.matchAll(regex)];
    const usernames = matches.map((match) => match[1]);
    return Array.from(new Set(usernames));
};

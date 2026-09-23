export const formatDate = (date) => {
    return new Date(date).toLocaleString('sv-SE', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
    });
}
function requireSeller(req, res, next) {
    if (!req.user) {
        return res.status(401).json({ error: "Not authenticated" });
    }

    if (req.user.role !== 'seller') {
        return res.status(403).json({ error: "Access denied. Sellers only." });
    }

    next();
}

module.exports = requireSeller;

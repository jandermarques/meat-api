import * as restify from 'restify';
import { NotFoundError } from 'restify-errors';
import * as mongoose from 'mongoose';

import { ModelRouter } from '../common/model-router';
import { Review } from './reviews.model';

class ReviewsRouter extends ModelRouter<Review> {

    constructor() {
        super(Review);
    }

    /*
    findById = (req, res, next) => {
        this.model.findById(req.params.id)
            .populate('user', 'name')
            .populate('restaurant', 'name')
            .then(this.render(res, next))
            .catch(next);
    }
    */

    protected prepareOne(query: mongoose.DocumentQuery<Review, Review>): mongoose.DocumentQuery<Review, Review> {
        return query.populate('user', 'name')
            .populate('restaurant', 'name');
    }

    protected prepareAll(query: mongoose.DocumentQuery<Review[], Review>): mongoose.DocumentQuery<Review[], Review> {
        return query.populate('user', 'name')
            .populate('restaurant', 'name');
    }

    envelope(document) {
        let resource = super.envelope(document);
        const restId = document.restaurant._id ? document.restaurant._id : document.restaurant;
        resource._links.restaurant = `/restaurants/${restId}`;

        return resource;
    }

    applyRoutes(application: restify.Server) {

        application.get(`${this.basePath}`, this.findAll);

        application.get(`${this.basePath}/:id`, [this.validateId, this.findById]);

        application.post(`${this.basePath}`, this.save);

    }
}

export const reviewsRouter = new ReviewsRouter();
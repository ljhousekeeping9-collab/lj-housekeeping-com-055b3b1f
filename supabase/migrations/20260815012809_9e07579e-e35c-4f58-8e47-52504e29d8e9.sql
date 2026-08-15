CREATE TABLE public.reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  author_name text NOT NULL,
  location text,
  rating smallint NOT NULL DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
  quote text NOT NULL,
  approved boolean NOT NULL DEFAULT false
);

GRANT SELECT, INSERT ON public.reviews TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.reviews TO authenticated;
GRANT ALL ON public.reviews TO service_role;

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read approved reviews"
ON public.reviews FOR SELECT
TO anon, authenticated
USING (approved = true);

CREATE POLICY "Anyone can submit a review"
ON public.reviews FOR INSERT
TO anon, authenticated
WITH CHECK (approved = false);

CREATE POLICY "Admins can read all reviews"
ON public.reviews FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update reviews"
ON public.reviews FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete reviews"
ON public.reviews FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

INSERT INTO public.reviews (author_name, location, rating, quote, approved) VALUES
('Marissa T.', 'La Quinta, CA', 5, 'Professional, reliable, and pays attention to the details. Our space has never looked better.', true),
('Andre P.', 'Palm Desert, CA', 5, 'Our space looks and feels completely different after every cleaning. Highly recommend.', true),
('Danielle R.', 'Indio, CA', 5, 'Great communication and excellent attention to detail. We trust LJ Housekeeping completely.', true),
('Kevin M.', 'Coachella Valley', 5, 'Consistent, thorough, and respectful of our home. One less thing to worry about every week.', true);
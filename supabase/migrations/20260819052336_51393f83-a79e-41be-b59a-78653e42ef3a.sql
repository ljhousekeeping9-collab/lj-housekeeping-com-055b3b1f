CREATE SCHEMA IF NOT EXISTS app_private;
GRANT USAGE ON SCHEMA app_private TO authenticated, service_role;

CREATE OR REPLACE FUNCTION app_private.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$function$;

REVOKE ALL ON FUNCTION app_private.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION app_private.has_role(uuid, public.app_role) TO authenticated, service_role;

-- Repoint every policy to the private function
DROP POLICY "Admins can update leads" ON public.leads;
DROP POLICY "Admins can view leads" ON public.leads;
DROP POLICY "Admins can delete notes" ON public.lead_notes;
DROP POLICY "Admins can add notes" ON public.lead_notes;
DROP POLICY "Admins can view notes" ON public.lead_notes;
DROP POLICY "Admins can delete reviews" ON public.reviews;
DROP POLICY "Admins can update reviews" ON public.reviews;
DROP POLICY "Admins can read all reviews" ON public.reviews;

CREATE POLICY "Admins can view leads" ON public.leads FOR SELECT TO authenticated
  USING (app_private.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update leads" ON public.leads FOR UPDATE TO authenticated
  USING (app_private.has_role(auth.uid(), 'admin'))
  WITH CHECK (app_private.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can view notes" ON public.lead_notes FOR SELECT TO authenticated
  USING (app_private.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can add notes" ON public.lead_notes FOR INSERT TO authenticated
  WITH CHECK (app_private.has_role(auth.uid(), 'admin') AND auth.uid() = author_id);
CREATE POLICY "Admins can delete notes" ON public.lead_notes FOR DELETE TO authenticated
  USING (app_private.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can read all reviews" ON public.reviews FOR SELECT TO authenticated
  USING (app_private.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update reviews" ON public.reviews FOR UPDATE TO authenticated
  USING (app_private.has_role(auth.uid(), 'admin'))
  WITH CHECK (app_private.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete reviews" ON public.reviews FOR DELETE TO authenticated
  USING (app_private.has_role(auth.uid(), 'admin'));

DROP FUNCTION IF EXISTS public.has_role(uuid, public.app_role);
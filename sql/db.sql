CREATE TABLE pageviews (
  browser text,
  country text,
	id bigint GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
	inserted_at timestamp WITH time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
  ip text,
  os text,
  referrer text,
	user_agent text,
  url text
);

CREATE FUNCTION pageviews_url_count (start_time text, end_time text)
  RETURNS TABLE (
    url text,
    pageviews bigint
  )
  AS $$
  SELECT
    url,
    COUNT(*)
  FROM
    pageviews
  WHERE
    inserted_at >= CAST(start_time AS timestamptz)
    AND inserted_at < CAST(end_time AS timestamptz)
  GROUP BY
    1
  ORDER BY
    2 DESC
$$
LANGUAGE sql
STABLE;

CREATE FUNCTION pageviews_browser_count (start_time text, end_time text)
  RETURNS TABLE (
    browser text,
    pageviews bigint
  )
  AS $$
  SELECT
    browser,
    COUNT(*)
  FROM
    pageviews
  WHERE
    inserted_at >= CAST(start_time AS timestamptz)
    AND inserted_at < CAST(end_time AS timestamptz)
  GROUP BY
    1
  ORDER BY
    2 DESC
$$
LANGUAGE sql
STABLE;

CREATE FUNCTION pageviews_os_count (start_time text, end_time text)
  RETURNS TABLE (
    os text,
    pageviews bigint
  )
  AS $$
  SELECT
    os,
    COUNT(*)
  FROM
    pageviews
  WHERE
    inserted_at >= CAST(start_time AS timestamptz)
    AND inserted_at < CAST(end_time AS timestamptz)
  GROUP BY
    1
  ORDER BY
    2 DESC
$$
LANGUAGE sql
STABLE;
